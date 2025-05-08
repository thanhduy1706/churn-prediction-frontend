export async function loadCSVFile(filename: string): Promise<string> {
  try {
    const response = await fetch(`/data/${filename}`)
    if (!response.ok) {
      throw new Error(`Failed to load CSV file: ${response.statusText}`)
    }
    return await response.text()
  } catch (error) {
    console.error("Error loading CSV file:", error)
    throw error
  }
}
