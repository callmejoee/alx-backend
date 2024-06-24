#!/usr/bin/env python3

''' module 1 '''
from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    ''' function to calc index '''
    start = (page - 1) * page_size
    end = start + page_size
    return (start, end)
