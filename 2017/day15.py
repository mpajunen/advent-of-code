import common.day as common

fa, fb = 16807, 48271
divider = 2147483647
mask = 2 ** 16 - 1


def main():
    raw_data = common.read_input(15)
    data = [row.pop() for row in raw_data]

    common.solve_day(
        data,
        (solve1, 577),
        (solve2, 316),
    )


def solve1(incoming):
    same = get_matches(incoming, 40000000)

    return len(same)


def solve2(incoming):
    same = get_matches(incoming, 5000000, (4, 8))

    return len(same)


def get_matches(initial, limit, multiples=(1, 1)):
    a, b = initial
    ma, mb = multiples

    pairs = zip(
        generate(a, fa, limit, ma),
        generate(b, fb, limit, mb),
    )

    return [a for a, b in pairs if (a - b) & mask == 0]


def generate(start, factor, limit, multiple):
    value = start
    for _ in range(0, limit):
        while True:
            value = (value * factor) % divider
            if value % multiple == 0:
                yield value
                break


if __name__ == "__main__":
    main()
