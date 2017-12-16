import copy


def detect_simple(step, start):
    current = step(copy.copy(start))
    cycle_length = 1

    while current != start:
        current = step(current)
        cycle_length += 1

    return cycle_length


# Tortoise and hare cycle detection
# Adapted from https://en.wikipedia.org/wiki/Cycle_detection
def tortoise_and_hare(step, start):
    tortoise = step(copy.copy(start))
    hare = step(step(copy.copy(start)))
    while tortoise != hare:
        tortoise = step(tortoise)
        hare = step(step(hare))

    cycle_start = 0
    tortoise = copy.copy(start)
    while tortoise != hare:
        tortoise = step(tortoise)
        hare = step(hare)
        cycle_start += 1

    cycle_length = 1
    hare = step(copy.copy(tortoise))
    while tortoise != hare:
        hare = step(hare)
        cycle_length += 1

    return cycle_length, cycle_start
