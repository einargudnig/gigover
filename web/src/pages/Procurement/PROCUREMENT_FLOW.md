# Procurement System Flow

This document outlines the main flows and component relationships in the procurement system.

## Main Entry Point

-   `TenderLayout.tsx` (Base layout for all procurement routes)

## 1. My Tenders Flow (Creating & Managing Tenders)

```
MyTendersList.tsx (Index) → TenderDetails.tsx
                        → TenderOffersList.tsx → TenderOfferDetails.tsx → TenderOfferAnswer.tsx
```

### Tender Creation Steps

```
NewTenderCreate.tsx → CreateTender.tsx
                   → AddItems.tsx
                   → PublishTender.tsx
                   → AddBidder.tsx
```

## 2. Invitation Flow (Receiving & Responding to Tenders)

```
InvitedTendersList.tsx → InvitedTendersDetails.tsx
```

## 3. My Offers Flow (Managing Submitted Offers)

```
MyOffersList.tsx → MyOffersDetails.tsx
```

## 4. Direct Bidding Flow (Single Bidder System)

```
BidsList.tsx → BidDetails.tsx
BidResponsesList.tsx → BidResponseDetails.tsx
```

## File Management Integration

All tender documents are managed through:

```
TenderFolder.tsx → TendersFolder.tsx → TenderFile.tsx
                → OffersFolder.tsx → OfferFiles.tsx
```

## System Breakdown

### Creator Side (Company Creating Tenders)

1. List/Create Tenders
2. Manage Tender Details
3. Review Received Offers
4. Answer/Accept Offers

### Bidder Side (Company Responding to Tenders)

1. View Received Invitations
2. Submit Offers
3. Track My Offers
4. Manage Offer Documents

### Direct Bidding (Simplified Flow)

1. Create Direct Bid
2. Manage Bid Details
3. View Bid Responses
4. Review Response Details

## Notes

-   Each major flow (Tenders, Offers, Bids) has its own list → details → action pattern
-   File management is integrated throughout all flows
-   The system supports both multi-bidder tenders and direct single-bidder scenarios
