export interface SubscriptionOperations {
  manageSubscription: (accessToken: string, plan: 'premium' | 'enterprise') => Promise<void>;
}

export type UseSubscriptionReturn = SubscriptionOperations;