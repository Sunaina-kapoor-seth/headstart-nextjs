import { NextApiRequest, NextApiResponse } from 'next'
import { OrderCalculateResponse, OrderWorksheet } from 'ordercloud-javascript-sdk'
import { withOcWebhookAuth } from '@ordercloud/catalyst'

export const config = {
  api: {
    bodyParser: false, // Required for raw body validation
  },
};

export type OrderCloudEnvironment = 'Production' | 'Staging' | 'Sandbox' | 'Qa'

export interface OrderCheckoutIntegrationEvent<T = null> {
  OrderWorksheet: OrderWorksheet
  Environment: OrderCloudEnvironment
  OrderCloudAccessToken: string
  ConfigData: T
}

// Correct handler signature
const OrderCalculateHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<OrderCalculateResponse>
) => {
  const event = req.body as OrderCheckoutIntegrationEvent

  return res.status(200).send({
    TaxTotal: event.OrderWorksheet.Order.BillingAddress ? 5 : 0,
  })
}

export default withOcWebhookAuth(OrderCalculateHandler)
