#!/usr/bin/env python3

''' module 1 '''
import csv
import math
from typing import List
from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    ''' function to calc index '''
    start = (page - 1) * page_size
    end = start + page_size
    return (start, end)


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """
        Retrieves a page of data.

        """
    assert isinstance(page, int) and page > 0, "Page positive "
    assert isinstance(page_size, int) and page_size > 0, "Page size positive"

    start, end = index_range(page, page_size)
    data = self.dataset()

    if start >= len(data):
        return []

    return data[start:end]
