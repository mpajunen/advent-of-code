import copy
import os
import time


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
    filename = os.path.join(os.path.dirname(__file__), '../input/day{0}.txt'.format(day))
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


def solve_day(data, *parts):
    for part in parts:
        solve_part(copy.copy(data), part)


def solve_part(data, part):
    start_time = time.time()
    solve, expected = part
    result = solve(data)

    print('')
    print(result)
    print('  @ %f seconds' % (time.time() - start_time))

    if expected:
        assert result == expected, 'Expected "%s" but the result was "%s".' % (expected, result)
        print('  expected result')
