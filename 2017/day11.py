import common.day as common
from common.grid_hex import flat_distance, flat_move


def main():
    data = common.read_input(11, splitter=',')

    common.solve_day(
        data,
        (solve, (794, 1524)),
    )


def solve(incoming):
    position = 0, 0
    dist = 0
    max_dist = 0

    for direction in incoming:
        position = flat_move(position, direction)
        dist = flat_distance(position)
        max_dist = max(dist, max_dist)

    return dist, max_dist


if __name__ == "__main__":
    main()
