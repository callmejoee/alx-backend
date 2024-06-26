#!/usr/bin/env python3
''' module 0 '''

from base_caching import BaseCaching


class BasicCache(BaseCaching):
    ''' basicchache that inherits '''
    def put(self, key, item):
        ''' put func '''
        if key is None or item is None:
            return
        self.cache_data[key] = item

    def get(self, key):
        ''' get function '''
        return self.cache_data.get(key, None)
