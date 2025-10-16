// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title CreatorPlatform
 * @dev Смарт-контракт для платформы создателей контента с оплатой в BNB
 * Комиссия платформы: 1% с каждой транзакции
 */
contract CreatorPlatform is ReentrancyGuard, Ownable, Pausable {
    
    // Комиссия платформы (1% = 100 basis points)
    uint256 public platformFee = 100; // 1%
    uint256 public constant FEE_DENOMINATOR = 10000; // 100% = 10000
    
    // Адрес для сбора комиссий
    address payable public feeCollector;
    
    // Структура кампании
    struct Campaign {
        uint256 id;
        address payable brand;
        uint256 totalBudget;
        uint256 remainingBudget;
        uint256 prizePool;
        uint256 createdAt;
        bool isActive;
        string metadataURI; // IPFS или server URL с деталями кампании
    }
    
    // Структура выплаты
    struct Payout {
        uint256 campaignId;
        address payable creator;
        uint256 amount;
        uint256 timestamp;
        bool completed;
    }
    
    // Маппинги
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Payout) public payouts;
    mapping(address => uint256[]) public brandCampaigns;
    mapping(address => uint256[]) public creatorPayouts;
    
    // Счетчики
    uint256 public campaignCounter;
    uint256 public payoutCounter;
    
    // События
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed brand,
        uint256 totalBudget,
        uint256 prizePool
    );
    
    event PayoutCreated(
        uint256 indexed payoutId,
        uint256 indexed campaignId,
        address indexed creator,
        uint256 amount
    );
    
    event PayoutCompleted(
        uint256 indexed payoutId,
        address indexed creator,
        uint256 amount,
        uint256 platformFeeAmount
    );
    
    event CampaignClosed(uint256 indexed campaignId, uint256 refundAmount);
    event FeeCollectorUpdated(address indexed newFeeCollector);
    event PlatformFeeUpdated(uint256 newFee);
    
    constructor() {
        feeCollector = payable(msg.sender);
    }
    
    /**
     * @dev Создание новой кампании
     */
    function createCampaign(string memory _metadataURI) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
        returns (uint256) 
    {
        require(msg.value > 0, "Budget must be greater than 0");
        
        campaignCounter++;
        
        campaigns[campaignCounter] = Campaign({
            id: campaignCounter,
            brand: payable(msg.sender),
            totalBudget: msg.value,
            remainingBudget: msg.value,
            prizePool: msg.value,
            createdAt: block.timestamp,
            isActive: true,
            metadataURI: _metadataURI
        });
        
        brandCampaigns[msg.sender].push(campaignCounter);
        
        emit CampaignCreated(campaignCounter, msg.sender, msg.value, msg.value);
        
        return campaignCounter;
    }
    
    /**
     * @dev Создание выплаты креатору (только владелец кампании)
     */
    function createPayout(
        uint256 _campaignId,
        address payable _creator,
        uint256 _amount
    ) 
        external 
        nonReentrant 
        whenNotPaused 
        returns (uint256) 
    {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(campaign.id > 0, "Campaign does not exist");
        require(campaign.brand == msg.sender, "Only campaign owner can create payouts");
        require(campaign.isActive, "Campaign is not active");
        require(_amount > 0, "Amount must be greater than 0");
        require(campaign.remainingBudget >= _amount, "Insufficient campaign budget");
        
        payoutCounter++;
        
        payouts[payoutCounter] = Payout({
            campaignId: _campaignId,
            creator: _creator,
            amount: _amount,
            timestamp: block.timestamp,
            completed: false
        });
        
        creatorPayouts[_creator].push(payoutCounter);
        
        emit PayoutCreated(payoutCounter, _campaignId, _creator, _amount);
        
        return payoutCounter;
    }
    
    /**
     * @dev Выполнение выплаты креатору
     */
    function completePayout(uint256 _payoutId) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        Payout storage payout = payouts[_payoutId];
        Campaign storage campaign = campaigns[payout.campaignId];
        
        require(payout.campaignId > 0, "Payout does not exist");
        require(!payout.completed, "Payout already completed");
        require(campaign.brand == msg.sender, "Only campaign owner can complete payouts");
        require(campaign.remainingBudget >= payout.amount, "Insufficient campaign budget");
        
        // Расчет комиссии
        uint256 feeAmount = (payout.amount * platformFee) / FEE_DENOMINATOR;
        uint256 creatorAmount = payout.amount - feeAmount;
        
        // Обновление состояния
        payout.completed = true;
        campaign.remainingBudget -= payout.amount;
        
        // Переводы
        (bool successCreator, ) = payout.creator.call{value: creatorAmount}("");
        require(successCreator, "Transfer to creator failed");
        
        (bool successFee, ) = feeCollector.call{value: feeAmount}("");
        require(successFee, "Transfer of fee failed");
        
        emit PayoutCompleted(_payoutId, payout.creator, creatorAmount, feeAmount);
    }
    
    /**
     * @dev Закрытие кампании и возврат оставшихся средств
     */
    function closeCampaign(uint256 _campaignId) 
        external 
        nonReentrant 
    {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(campaign.id > 0, "Campaign does not exist");
        require(campaign.brand == msg.sender, "Only campaign owner can close");
        require(campaign.isActive, "Campaign already closed");
        
        campaign.isActive = false;
        uint256 refundAmount = campaign.remainingBudget;
        campaign.remainingBudget = 0;
        
        if (refundAmount > 0) {
            (bool success, ) = campaign.brand.call{value: refundAmount}("");
            require(success, "Refund failed");
        }
        
        emit CampaignClosed(_campaignId, refundAmount);
    }
    
    /**
     * @dev Получить кампании бренда
     */
    function getBrandCampaigns(address _brand) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return brandCampaigns[_brand];
    }
    
    /**
     * @dev Получить выплаты креатора
     */
    function getCreatorPayouts(address _creator) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return creatorPayouts[_creator];
    }
    
    /**
     * @dev Обновить адрес сборщика комиссий
     */
    function updateFeeCollector(address payable _newFeeCollector) 
        external 
        onlyOwner 
    {
        require(_newFeeCollector != address(0), "Invalid address");
        feeCollector = _newFeeCollector;
        emit FeeCollectorUpdated(_newFeeCollector);
    }
    
    /**
     * @dev Обновить размер комиссии (только владелец)
     */
    function updatePlatformFee(uint256 _newFee) 
        external 
        onlyOwner 
    {
        require(_newFee <= 1000, "Fee cannot exceed 10%"); // Максимум 10%
        platformFee = _newFee;
        emit PlatformFeeUpdated(_newFee);
    }
    
    /**
     * @dev Пауза контракта
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Снятие с паузы
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Получить детали кампании
     */
    function getCampaign(uint256 _campaignId) 
        external 
        view 
        returns (
            uint256 id,
            address brand,
            uint256 totalBudget,
            uint256 remainingBudget,
            uint256 prizePool,
            uint256 createdAt,
            bool isActive,
            string memory metadataURI
        ) 
    {
        Campaign memory campaign = campaigns[_campaignId];
        return (
            campaign.id,
            campaign.brand,
            campaign.totalBudget,
            campaign.remainingBudget,
            campaign.prizePool,
            campaign.createdAt,
            campaign.isActive,
            campaign.metadataURI
        );
    }
    
    receive() external payable {}
}

