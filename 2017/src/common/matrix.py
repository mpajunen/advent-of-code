def flip_vertical(a):
    return a[::-1]


def get_rotations(a):
    rotations = [a]
    for _ in range(3):
        a = rotate_ccw(a)
        rotations.append(a)

    return rotations


def rotate_ccw(a):
    return tuple(reversed(list(zip(*a))))


if __name__ == "__main__":
    assert flip_vertical(((1, 0), (0, 0))) == ((0, 0), (1, 0))

    assert rotate_ccw(((1, 0), (0, 0))) == ((0, 0), (1, 0))
    assert rotate_ccw(((1, 0, 0), (2, 0, 0), (0, 0, 0))) == ((0, 0, 0), (0, 0, 0), (1, 2, 0))

    print('All ok')
