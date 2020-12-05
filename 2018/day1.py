import common.day as day


def main():
    data = day.read_input(1, char_split=True)

    day.solve_day(
        data,
        (solve, 997),
        (solve_halfway, 1358),
    )


def solve(digits, offset=1):
    next_digits = digits[offset:] + digits[:offset]
    pairs = zip(digits, next_digits)
    matches = [i for (i, j) in pairs if i == j]

    return sum(matches)


def solve_halfway(digits):
    return solve(digits, len(digits) // 2)


assert solve_halfway([1, 2, 1, 2]) == 6

if __name__ == "__main__":
    main()
