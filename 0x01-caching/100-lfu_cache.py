#!/usr/bin/env python3
''' module 0 '''

from base_caching import BaseCaching
from collections import OrderedDict, defaultdict


class LFUCache(BaseCaching):
    ''' LFUCache inherits from BaseCaching and implements LFU caching '''

    def __init__(self):
        ''' Initialize the LFUCache class '''
        super().__init__()
        self.cache_data = OrderedDict()
        self.frequency = defaultdict(int)

    def put(self, key, item):
        ''' Add an item to the cache '''
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.cache_data.move_to_end(key)

        if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            min_freq = min(self.frequency.values())
            least_freq_keys = [key for key, freq in
                               self.frequency.items() if freq == min_freq]
            for k in least_freq_keys:
                if k in self.cache_data:
                    print(f"DISCARD: {k}")
                    del self.cache_data[k]
                    del self.frequency[k]
                    break

        self.cache_data[key] = item
        self.frequency[key] += 1

    def get(self, key):
        ''' Retrieve an item from the cache '''
        if key is None or key not in self.cache_data:
            return None

        self.cache_data.move_to_end(key)
        self.frequency[key] += 1
        return self.cache_data[key]
