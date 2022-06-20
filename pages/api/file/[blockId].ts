import { NextApiRequest, NextApiResponse } from 'next'
import { getBlock } from '../../../lib/notion'

// https://developers.notion.com/reference/file-object
type FileObject =
  | {
      type: 'external'
      external: {
        url: string
      }
    }
  | {
      type: 'file'
      file: {
        url: string
        expiry_time: string
      }
    }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const blockId = req.query.blockId as string

  // get block
  getBlock(blockId)
    .then((block) => {
      // https://developers.notion.com/reference/block
      switch (block.type) {
        case 'pdf':
        case 'image':
        case 'video':
        case 'file':
        case 'audio':
          const file: FileObject = block[block.type]
          if (file.type === 'external') {
            res.status(200).send({ url: file.external.url })
          } else {
            res.status(200).send({ url: file.file.url })
          }
          break

        default:
          res.status(500).send({
            error: `error processing the ${block.type} block ${blockId} only pdf, image, video, file and audio blocks are supported`
          })
          break
      }
    })
    .catch((e) => {
      res.status(500).send({
        error: `error retrieving the block ${blockId} ${e}`
      })
    })
}
