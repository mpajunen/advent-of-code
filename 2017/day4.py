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
    processed = day.process_table(
        phrases,
        check_row=has_unique_words,
    )

    return len(processed)


def sort_word(word):
    return cat(sorted(word))


def solve_no_anagrams(phrases):
    processed = day.process_table(
        phrases,
        modify=sort_word,
        check_row=has_unique_words,
    )

    return len(processed)


if __name__ == "__main__":
    main()
