import type { Movie } from "../src/interfaces/movie";
import { MovieEditor } from "../src/components/MovieEditor";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("MovieEditor Component", () => {
    const mockMovie: Movie = {
        id: "test-movie-123",
        title: "The Test Movie",
        rating: 8,
        description: "A movie for testing",
        released: 2020,
        soundtrack: [{ id: "song1", name: "Test Song", by: "Test Artist" }],
        watched: {
            seen: true,
            liked: true,
            when: "2023-01-01",
        },
    };

    const mockChangeEditing = jest.fn();
    const mockEditMovie = jest.fn();
    const mockDeleteMovie = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        render(
            <MovieEditor
                changeEditing={mockChangeEditing}
                movie={mockMovie}
                editMovie={mockEditMovie}
                deleteMovie={mockDeleteMovie}
            ></MovieEditor>,
        );
    });

    test("renders MovieEditor with initial movie data", () => {
        const title = screen.getByDisplayValue("The Test Movie");

        expect(title).toBeInTheDocument();
    });

    test("changes movie description", () => {
        const description = screen.getByDisplayValue("A movie for testing");
        userEvent.type(description, " things");
        expect(description).toHaveValue("A movie for testing things");
    });

    test("changes movie released year", () => {
        const released = screen.getByDisplayValue("2020");
        userEvent.type(released, "{backspace}{backspace}19");
        expect(released).toHaveValue(2019);
    });

    test("changes movie title", () => {
        const title = screen.getByDisplayValue("The Test Movie");
        userEvent.type(title, " 2");
        expect(title).toHaveValue("The Test Movie 2");
    });

    test("changes movie rating", () => {
        const rating = screen.getByDisplayValue("⭐⭐⭐⭐✰");
        userEvent.selectOptions(rating, "⭐⭐✰✰✰");
        expect(rating).toHaveValue("4");
    });

    test("cancel button", () => {
        const description = screen.getByDisplayValue("A movie for testing");
        const released = screen.getByDisplayValue("2020");
        const cancel = screen.getByRole("button", {name: "Cancel"})
        userEvent.type(description, " things");
        userEvent.type(released, "{backspace}{backspace}19");
        userEvent.click(cancel);

        expect(mockChangeEditing).toHaveBeenCalledTimes(1);
        expect(mockEditMovie).toHaveBeenCalledTimes(0);
        expect(mockDeleteMovie).toHaveBeenCalledTimes(0);
    });

    test("save button", () => {
        const description = screen.getByDisplayValue("A movie for testing");
        userEvent.type(description, " things");

        const released = screen.getByDisplayValue("2020");
        userEvent.type(released, "{backspace}{backspace}19");

        const title = screen.getByDisplayValue("The Test Movie");
        userEvent.type(title, " 2");
        
        const rating = screen.getByDisplayValue("⭐⭐⭐⭐✰");
        userEvent.selectOptions(rating, "⭐⭐✰✰✰");

        const save = screen.getByRole("button", {name: "Save"})
        userEvent.click(save);


        expect(mockChangeEditing).toHaveBeenCalledTimes(1);
        expect(mockEditMovie).toHaveBeenCalledWith(mockMovie.id, {
            ...mockMovie,
            title: "The Test Movie 2",
            released: 2019,
            rating: 4,
            description: "A movie for testing things",
            soundtrack: mockMovie.soundtrack,
        })
        expect(mockDeleteMovie).toHaveBeenCalledTimes(0);
    });
});
