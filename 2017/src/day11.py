import common.day as day
from common.grid_hex import flat_move, step_distance


def main():
    data = day.read_input(11, splitter=',')

    day.solve_day(
        data,
        (solve, (794, 1524)),
    )


def solve(incoming):
    position = 0, 0
    dist = 0
    max_dist = 0

    for direction in incoming:
        position = flat_move(position, direction)
        dist = step_distance(position)
        max_dist = max(dist, max_dist)

    return dist, max_dist


if __name__ == "__main__":
    main()
