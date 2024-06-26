#!/usr/bin/env python3
''' module 0 '''

from base_caching import BaseCaching
from collections import OrderedDict


class LIFOCache(BaseCaching):
    ''' FIFOCache  inherits from BaseCaching and implements FIFO caching '''

    def __init__(self):
        ''' Initialize the FIFOCache class '''
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        ''' Add an item to the cache '''
        if key is None or item is None:
            return

        if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            first_key = next(reversed(self.cache_data))
            print(f"DISCARD: {first_key}")
            self.cache_data.pop(first_key)

        self.cache_data[key] = item

    def get(self, key):
        ''' Retrieve an item from the cache '''
        if key is None:
            return None
        return self.cache_data.get(key, None)
