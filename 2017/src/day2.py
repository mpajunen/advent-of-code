import common.day as day


def main():
    data = day.read_input(2)

    day.solve_day(
        data,
        (check_solve, 45158),
        (div_solve, 294),
    )


def checksum(line):
    return max(line) - min(line)


def check_solve(lines):
    return sum(map(checksum, lines))


def line_div(line):
    for i in line:
        for j in line:
            if i != j and i % j == 0:
                return i // j


def div_solve(lines):
    return sum(map(line_div, lines))


if __name__ == "__main__":
    main()
