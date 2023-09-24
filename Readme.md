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
