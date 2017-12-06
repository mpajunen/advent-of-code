import os


def read_input(day, char_split=False):
    def handle_value(raw):
        try:
            return int(raw)
        except ValueError:
            return raw

    def handle_line(raw):
        split = list(raw) if char_split else raw.split()
        processed = list(map(handle_value, split))

        return processed[0] if len(processed) == 1 else processed

    lines = list(map(handle_line, read_raw_input(day)))

    return lines[0] if len(lines) == 1 else lines


def read_raw_input(day):
    filename = os.path.join(os.path.dirname(__file__), 'input/day{0}.txt'.format(day))
    with open(filename) as f:
        lines = f.read().splitlines()
    return lines


def process_list(values, check=lambda v: True, modify=lambda v: v):
    return list(map(modify, filter(check, values)))


def process_table(
        raw_rows,
        check=lambda cell: True,
        modify=lambda cell: cell,
        check_row=lambda row: True,
        modify_row=lambda row: row,
):
    rows = map(lambda cells: process_list(cells, check, modify), raw_rows)

    return process_list(rows, check_row, modify_row)


# Tortoise and hare cycle detection
# Adapted from https://en.wikipedia.org/wiki/Cycle_detection
def tortoise_and_hare(step, start):
    tortoise = step(start)
    hare = step(step(start))
    while tortoise != hare:
        tortoise = step(tortoise)
        hare = step(step(hare))

    cycle_start = 0
    tortoise = start
    while tortoise != hare:
        tortoise = step(tortoise)
        hare = step(hare)
        cycle_start += 1

    cycle_length = 1
    hare = step(tortoise)
    while tortoise != hare:
        hare = step(hare)
        cycle_length += 1

    return cycle_length, cycle_start
