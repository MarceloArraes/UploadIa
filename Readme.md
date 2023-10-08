### Things that I learned or remembered:

- Styling the Upload file using a label and hiding the actual native input.
  - <form className="space-y-6">
    <label
                            htmlFor="video"
                          >
    {" "}
    Update Video{" "}
    </label>
    <input
                      type="file"
                      name="video"
                      id="video"
                      accept="video/mp4"
                      className="sr-only"
                    />
    </form>
- Its possible to change the opacity of any color like this:

  - hover:bg-primary/5

- using `shadcn/ui` (NOT A PACKAGE but the components copied inside the project, very cool proposition to be full owner of the code) for components done with Radix and tailwind. Very easy to modify.
- Semantic <aside> for lateral column
- `lucide-react` for icons
- `axios` to make backend requisitions
-
