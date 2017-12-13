import common


def main():
    raw_data = common.read_raw_input(13)
    data = common.process_list(
        raw_data,
        modify=lambda row: [int(n) for n in row.split(': ')]
    )

    common.solve_day(
        data,
        (get_score, 1904),
        (solve2, 3833504),
    )


def is_at_zero(size, now):
    return now % (2 * (size - 1)) == 0


def get_score(layers):
    scores = [depth * size for depth, size in layers if is_at_zero(size, depth)]

    return sum(scores)


def is_caught(layers, start):
    for d, s in layers:
        if is_at_zero(s, d + start):
            return True

    return False


def solve2(incoming):
    start = 0

    while is_caught(incoming, start):
        start += 1

    return start


if __name__ == "__main__":
    main()
