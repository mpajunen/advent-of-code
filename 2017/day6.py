import common


def main():
    data = common.read_input(6)

    common.solve_day(
        data,
        (solve, (3156, 1610)),
    )


def distribute(position):
    position_count = len(position)
    max_pos = max(enumerate(position), key=lambda x: x[1])[0]
    max_val = position[max_pos]

    new_position = position[:max_pos] + [0] + position[(max_pos + 1):]
    for k in range(max_pos + 1, max_val + max_pos + 1):
        new_position[k % position_count] += 1

    return new_position


def solve(data):
    (length, start) = common.tortoise_and_hare(distribute, data)

    return length + start, length


def get_start(data):
    (length, _) = common.tortoise_and_hare(distribute, data)

    return length


if __name__ == "__main__":
    main()
