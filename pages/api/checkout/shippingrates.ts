import { NextApiRequest, NextApiResponse } from 'next'
import { ShipEstimateResponse } from 'ordercloud-javascript-sdk'
import { OrderCheckoutIntegrationEvent } from './ordercalculate'
import { withOcWebhookAuth } from '@ordercloud/catalyst'

// Required to allow raw request body for webhook signature validation
export const config = {
  api: {
    bodyParser: false,
  },
};

const ShippingRatesHandler = (
  req: NextApiRequest,
  res: NextApiResponse<ShipEstimateResponse>
) => {
  const event = req.body as OrderCheckoutIntegrationEvent

  res.status(200).send({
    ShipEstimates: [
      {
        ID: 'test',
        ShipEstimateItems: event.OrderWorksheet.LineItems.map((li) => ({
          LineItemID: li.ID,
          Quantity: li.Quantity,
        })),
        ShipMethods: [
          {
            ID: '1day',
            Name: 'Next Day Shipping',
            Cost: 50,
            EstimatedTransitDays: 1,
          },
          {
            ID: '2day',
            Name: 'Two Day Shipping',
            Cost: 25,
            EstimatedTransitDays: 2,
          },
          {
            ID: 'standard',
            Name: 'Standard Shipping',
            Cost: 12,
            EstimatedTransitDays: 5,
          },
        ],
      },
    ],
  })
}

export default withOcWebhookAuth(ShippingRatesHandler)
