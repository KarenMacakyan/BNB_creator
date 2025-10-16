import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './FAQPage.css';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'General',
      questions: [
        {
          q: 'What is BNB Creator Platform?',
          a: 'BNB Creator Platform is a marketplace connecting brands with TikTok and X (Twitter) content creators. Brands create campaigns, creators submit content, and payments are made directly in BNB cryptocurrency with only a 1% platform fee.'
        },
        {
          q: 'How does it work?',
          a: 'Brands create campaigns and deposit BNB into a smart contract. Creators submit their content (TikTok/X posts). Brands review submissions and select winners. Smart contracts automatically distribute payments to creators with a 1% platform fee deducted.'
        },
        {
          q: 'What makes this platform different?',
          a: 'We offer the lowest fees (1%), instant BNB payouts, smart contract security, no intermediaries, and support for both TikTok and X platforms. Plus, creators can participate in contests or direct deals.'
        },
      ]
    },
    {
      category: 'For Brands',
      questions: [
        {
          q: 'How do I create a campaign?',
          a: 'Connect your wallet, select "Brand" role, click "Create Campaign", fill in the details (title, budget, requirements, dates), and submit. Your BNB will be locked in a smart contract until you distribute it to creators.'
        },
        {
          q: 'What types of campaigns can I create?',
          a: 'You can create two types: Contests (creators compete for prizes based on performance) or Deals (direct agreements with creators for specific deliverables and compensation).'
        },
        {
          q: 'Can I get a refund?',
          a: 'Yes! You can close your campaign at any time and receive back any remaining budget that hasn\'t been paid out to creators.'
        },
        {
          q: 'How do I pay creators?',
          a: 'Select winning submissions in your campaign dashboard and initiate payouts. The smart contract will automatically transfer BNB to creators (minus 1% platform fee) when you complete the payout.'
        },
      ]
    },
    {
      category: 'For Creators',
      questions: [
        {
          q: 'How do I start earning?',
          a: 'Connect your wallet, select "Creator" role, browse active campaigns, create content on TikTok/X according to campaign requirements, submit your entry with the post link, and wait for brands to review.'
        },
        {
          q: 'When do I get paid?',
          a: 'You receive payment immediately when a brand approves your submission and initiates the payout. BNB is sent directly to your wallet via smart contract.'
        },
        {
          q: 'What are the requirements?',
          a: 'Each campaign has specific requirements (follower count, platforms, content type, hashtags). Make sure you meet all requirements before submitting to increase your chances of winning.'
        },
        {
          q: 'Can I submit to multiple campaigns?',
          a: 'Yes! You can submit to as many campaigns as you want, as long as you meet each campaign\'s requirements and follow the guidelines.'
        },
      ]
    },
    {
      category: 'Payments & Fees',
      questions: [
        {
          q: 'What is the platform fee?',
          a: 'Only 1% fee charged on successful payouts. This is automatically deducted by the smart contract when creators receive their payment. No other hidden fees.'
        },
        {
          q: 'Why BNB and not fiat currency?',
          a: 'BNB enables instant, borderless, secure payments via smart contracts. No banks, no delays, no high fees. Plus, it\'s transparent and verifiable on the blockchain.'
        },
        {
          q: 'Are there withdrawal fees?',
          a: 'No withdrawal fees from the platform. You only pay standard BSC network gas fees (usually less than $0.10) when receiving or sending BNB.'
        },
        {
          q: 'Is there a minimum payout?',
          a: 'No minimum payout amount. You receive exactly what the brand allocates to you, minus the 1% platform fee.'
        },
      ]
    },
    {
      category: 'Technical',
      questions: [
        {
          q: 'What wallet do I need?',
          a: 'You need MetaMask or any Web3 wallet that supports Binance Smart Chain (BSC). Install MetaMask browser extension and add the BSC network.'
        },
        {
          q: 'Is the platform secure?',
          a: 'Yes! All payments are handled by audited smart contracts on Binance Smart Chain. Funds are locked in the contract and can only be released by the brand owner or refunded.'
        },
        {
          q: 'What if I don\'t have BNB?',
          a: 'If you\'re a creator, you don\'t need BNB to start. If you\'re a brand, you can buy BNB on any major cryptocurrency exchange (Binance, Coinbase, etc.) and transfer it to your wallet.'
        },
        {
          q: 'Can I use this on mobile?',
          a: 'Yes! Use MetaMask mobile app with the built-in browser. The platform is fully responsive and works on all devices.'
        },
      ]
    },
    {
      category: 'Support',
      questions: [
        {
          q: 'What if my transaction fails?',
          a: 'Transaction failures are usually due to insufficient gas fees or network congestion. Make sure you have enough BNB for gas and try again. If issues persist, contact support.'
        },
        {
          q: 'How do I contact support?',
          a: 'Join our Discord/Telegram community or email support@bnbcreator.com. Our team responds within 24 hours on business days.'
        },
        {
          q: 'Can I get verified?',
          a: 'Yes! Verified creators get priority visibility and may qualify for reduced fees. Contact us with your portfolio and social media links to apply for verification.'
        },
      ]
    },
  ];

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="container">
        <div className="page-header">
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about the platform</p>
        </div>

        <div className="faq-content">
          {faqs.map((category, catIndex) => (
            <div key={catIndex} className="faq-category">
              <h2 className="category-title">{category.category}</h2>
              <div className="faq-list">
                {category.questions.map((item, qIndex) => {
                  const isOpen = openIndex === `${catIndex}-${qIndex}`;
                  return (
                    <div key={qIndex} className={`faq-item ${isOpen ? 'open' : ''}`}>
                      <button
                        className="faq-question"
                        onClick={() => toggleFAQ(catIndex, qIndex)}
                      >
                        <span>{item.q}</span>
                        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                      {isOpen && (
                        <div className="faq-answer">
                          <p>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="faq-cta">
          <h2>Still have questions?</h2>
          <p>Can't find the answer you're looking for? Contact our support team.</p>
          <a href="mailto:support@bnbcreator.com" className="btn btn-primary btn-lg">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;

