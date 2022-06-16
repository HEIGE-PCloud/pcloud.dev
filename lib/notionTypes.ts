export type NotionFileObject = {
  type: 'file'
  file: {
    url: string
    expiry_time: string
  }
}

export type ExternalFileObject = {
  type: 'external'
  external: {
    url: string
  }
}

export type FileObject = NotionFileObject | ExternalFileObject

export type EmojiObject = {
  type: 'emoji'
  emoji: string
}
