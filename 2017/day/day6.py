import common.cycle as cycle
import common.day as day


def main():
    data = day.read_input(6)

    day.solve_day(
        data,
        (solve, (3156, 1610)),
    )


def distribute(position):
    position_count = len(position)
    max_pos = max(enumerate(position), key=lambda x: x[1])[0]
    max_val = position[max_pos]

    new_position = position[:max_pos] + [0] + position[(max_pos + 1):]
    for k in range(max_val):
        new_position[(k + max_pos + 1) % position_count] += 1

    return new_position


def solve(data):
    (length, start) = cycle.tortoise_and_hare(distribute, data)

    return length + start, length


if __name__ == "__main__":
    main()
