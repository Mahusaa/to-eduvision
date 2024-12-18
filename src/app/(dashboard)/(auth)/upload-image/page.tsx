"use client"
import { useState } from 'react'
export default function Page() {
  const [file, setFile] = useState<File>()
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    try {
      const data = new FormData()
      data.set('file', file)

      const res = await fetch('api/upload-image', {
        method: 'POST',
        body: data,
      })

      if (!res.ok) throw new Error(await res.text())
      console.log("its upload")


    } catch (e) {
      console.error(e)
    }
  }
  return (
    <main>
      <form onSubmit={onSubmit}>
        <input
          type='file'
          name='file'
          onChange={(e) => setFile(e.target.files?.[0])}
        />
        <input type='submit' value="Upload" />
      </form>

    </main>
  )
}
