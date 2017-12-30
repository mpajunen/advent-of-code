import common.day as day


def main():
    raw_data = day.read_input(24, splitter='/')
    data = day.process_list(
        raw_data,
        modify=tuple,
    )

    day.solve_day(
        data,
        (solve, (1511, 1471)),
    )


def solve(incoming):
    bridges = build_options([], 0, set(incoming))

    all_strengths = map(get_strength, bridges)

    max_length = max(map(len, bridges))
    long_strengths = [get_strength(b) for b in bridges if len(b) == max_length]

    return max(all_strengths), max(long_strengths)


def get_strength(bridge):
    return sum([i + j for (i, j) in bridge])


def build_options(bridge, previous, remaining):
    options = [(i, j) for (i, j) in remaining if i == previous or j == previous]

    if len(options) == 0:
        return [bridge]

    return [o
            for (i, j) in options
            for o in build_options(bridge + [(i, j)], j if i == previous else i, remaining - {(i, j)})]


if __name__ == "__main__":
    main()
