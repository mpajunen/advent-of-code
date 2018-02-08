import common.day as day
from common.string import cat


def main():
    data = day.read_input(4)

    day.solve_day(
        data,
        (solve_unique, 383),
        (solve_no_anagrams, 265),
    )


def has_unique_words(words):
    return len(set(words)) == len(words)


def solve_unique(phrases):
    return sum(1 for row in phrases if has_unique_words(row))


def sort_word(word):
    return cat(sorted(word))


def solve_no_anagrams(phrases):
    return solve_unique([[sort_word(word) for word in row] for row in phrases])


if __name__ == "__main__":
    main()
