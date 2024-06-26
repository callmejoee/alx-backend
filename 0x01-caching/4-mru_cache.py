#!/usr/bin/env python3
''' module 0 '''

from base_caching import BaseCaching
from collections import OrderedDict


class MRUCache(BaseCaching):
    ''' MRUCache inherits from BaseCaching and implements MRU caching '''

    def __init__(self):
        ''' Initialize the MRUCache class '''
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        ''' Add an item to the cache '''
        if key is None or item is None:
            return
        if key in self.cache_data:
            self.cache_data.move_to_end(key)

        if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            # MRU: Remove the most recently used item
            last_key = next(reversed(self.cache_data))
            print(f"DISCARD: {last_key}")
            self.cache_data.pop(last_key)

        self.cache_data[key] = item

    def get(self, key):
        ''' Retrieve an item from the cache '''
        if key is None or key not in self.cache_data:
            return None

        self.cache_data.move_to_end(key)
        return self.cache_data[key]
