from collections import defaultdict

import common.day as day
from common.grid_cube import manhattan_distance


def main():
    raw_data = day.read_input(20, splitter=', ')
    data = day.process_table(
        raw_data,
        modify=lambda v: [int(coord) for coord in v[3:-1].split(',')],
    )

    day.solve_day(
        data,
        (solve1, 157),
        (solve2, 499),
    )


def solve1(incoming):
    # Eventually acceleration dominates
    distances = {number: manhattan_distance(a) for number, (_, _, a) in enumerate(incoming)}

    return min(distances, key=distances.get)


def solve2(incoming):
    remaining = set(range(len(incoming)))

    for time in range(0, 40):  # Range determined empirically
        particles = defaultdict(set)
        for number, particle in enumerate(incoming):
            if number in remaining:
                particles[position(particle, time)].add(number)

        for numbers in particles.values():
            if len(numbers) > 1:
                remaining -= numbers

    return len(remaining)


def position(particle, time):
    p, v, a = particle

    def get_axis(axis):
        # Standard acceleration term would be: a * (time ** 2) / 2
        # but acceleration is applied first here.
        return p[axis] + \
               v[axis] * time + \
               a[axis] * ((time + 1) * time) // 2

    return get_axis(0), get_axis(1), get_axis(2)  # Position, velocity, acceleration


if __name__ == "__main__":
    main()
