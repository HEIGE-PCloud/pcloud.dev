export enum FileType {
  external = 'external',
  file = 'file'
}

interface FileObjectBase {
  type: FileType
}

interface ExternalFileObjectBase extends FileObjectBase {
  type: FileType
  external: {
    url: string
  }
}

export interface ExternalFileObject extends ExternalFileObjectBase {
  type: FileType.external
}

interface NotionFileObjectBase extends FileObjectBase {
  type: FileType
  file: {
    url: string
    expiry_time: string
  }
}

export interface NotionFileObject extends NotionFileObjectBase {
  type: FileType.file
}

export type FileObject = NotionFileObject | ExternalFileObject
