import { NextApiRequest, NextApiResponse } from 'next'
import { getBlock } from '../../../lib/notion'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { blockId } = req.query

  blockId = blockId as string

  const block = await getBlock(blockId)

  // reject if not image
  if (block.type !== 'image') {
    res.status(500).send({ error: 'only image block is accepted' })
    return
  }

  // handle external image
  if (block.image.type === 'external') {
    res.status(200).send({ url: block.image.external.url })
    return
  }

  res.status(200).send({ url: block.image.file.url })
}
