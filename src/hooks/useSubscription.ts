import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface SubscriptionState {
  isPro: boolean;
  plan: 'free' | 'pro_monthly' | 'pro_yearly';
  status: 'free' | 'active' | 'past_due' | 'cancelled' | 'expired';
  willCancel: boolean;
  expiresAt: string | null;
  loading: boolean;
}

export function useSubscription(user: User | null): SubscriptionState {
  const [state, setState] = useState<SubscriptionState>({
    isPro: false, plan: 'free', status: 'free',
    willCancel: false, expiresAt: null, loading: true,
  });

  useEffect(() => {
    if (!supabase || !user) {
      setState(s => ({ ...s, loading: false }));
      return;
    }

    // Fetch current subscription
    const fetch = async () => {
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setState({
          isPro: data.status === 'active',
          plan: data.plan || 'free',
          status: data.status || 'free',
          willCancel: data.cancel_at_period_end || false,
          expiresAt: data.current_period_end,
          loading: false,
        });
      } else {
        setState(s => ({ ...s, loading: false }));
      }
    };

    fetch();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('subscription-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'subscriptions',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        const data = payload.new as any;
        if (data) {
          setState({
            isPro: data.status === 'active',
            plan: data.plan || 'free',
            status: data.status || 'free',
            willCancel: data.cancel_at_period_end || false,
            expiresAt: data.current_period_end,
            loading: false,
          });
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  return state;
}
