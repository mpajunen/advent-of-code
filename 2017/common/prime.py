import math


def is_prime(n):
    for d in range(2, int(math.ceil(math.sqrt(float(n))))):
        if n % d == 0:
            return False

    return True
