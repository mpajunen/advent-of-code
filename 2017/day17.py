import common.day as day


def main():
    data = 337

    day.solve_day(
        data,
        (solve1, 600),
        (solve2, 31220910),
    )


def solve1(incoming):
    buffer = [0]
    position = 0
    last_value = 2017

    for i in range(1, last_value + 1):
        position = (position + incoming) % i + 1
        buffer = buffer[:position] + [i] + buffer[position:]

    result = buffer[position + 1]

    return result


def solve2(incoming):
    position = 0
    last_value = 50000000
    result = 1

    for i in range(1, last_value + 1):
        position = (position + incoming) % i + 1

        if position == 1:
            result = i

    return result


if __name__ == "__main__":
    main()
