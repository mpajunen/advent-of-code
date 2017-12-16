import common.day as common

factors = {'A': 16807, 'B': 48271}
divider = 2147483647


def main():
    raw_data = common.read_input(15)
    data = {generator: start for (_, generator, _, _, start) in raw_data}

    common.solve_day(
        data,
        (solve1, 577),
        (solve2, 316),
    )


def solve1(incoming):
    mask = 2 ** 16 - 1

    a, b = incoming.get('A'), incoming.get('B')
    fa, fb = factors.get('A'), factors.get('B')

    result = 0

    for _ in range(0, 40000000):
        if a & mask == b & mask:
            result += 1
        a = (a * fa) % divider
        b = (b * fb) % divider

    return result


def solve2(incoming):
    mask = 2 ** 16 - 1

    a, b = incoming.get('A'), incoming.get('B')
    fa, fb = factors.get('A'), factors.get('B')

    result = 0

    for _ in range(0, 5000000):
        if a & mask == b & mask:
            result += 1

        a = (a * fa) % divider
        while a % 4 != 0:
            a = (a * fa) % divider

        b = (b * fb) % divider
        while b % 8 != 0:
            b = (b * fb) % divider

    return result


if __name__ == "__main__":
    main()
