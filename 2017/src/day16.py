import string

import common.cycle as cycle
import common.day as day
from common.string import cat

programs_start = list(string.ascii_lowercase[:16])


def main():
    raw_data = day.read_input(16, splitter=',')
    data = day.process_list(
        raw_data,
        modify=build_move,
    )

    day.solve_day(
        data,
        (solve1, 'cgpfhdnambekjiol'),
        (solve2, 'gjmiofcnaehpdlbk'),
    )


def build_move(raw):
    op, rest = raw[0], raw[1:].split('/')

    if op == 's':
        x = rest[0]
        return 's', int(x)
    if op == 'x':
        a, b = rest
        return 'x', (int(a), int(b))
    if op == 'p':
        a, b = rest
        return 'p', (a, b)


def make_moves(start, moves):
    programs = start.copy()

    for op, params in moves:
        if op == 's':
            i = params
            programs = programs[-i:] + programs[:-i]
        elif op == 'x':
            i, j = params
            programs[i], programs[j] = programs[j], programs[i]
        elif op == 'p':
            a, b = params
            i, j = programs.index(a), programs.index(b)
            programs[i], programs[j] = b, a

    return programs


def solve1(incoming):
    programs = make_moves(programs_start, incoming)

    return cat(programs)


def solve2(incoming):
    length = cycle.detect_simple(lambda x: make_moves(x, incoming), programs_start)
    iterations = int(1e9) % length
    programs = programs_start

    for _ in range(iterations):
        programs = make_moves(programs, incoming)

    return cat(programs)


if __name__ == "__main__":
    main()
