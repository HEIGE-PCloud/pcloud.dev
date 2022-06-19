import { NextApiRequest, NextApiResponse } from 'next'
import { getBlock } from '../../../lib/notion'

const cache: { [blockId: string]: { expiry_time: string; url: string } } = {}

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
    res.redirect(307, block.image.external.url)
    return
  }

  // if cache exists
  if (cache[block.id] && new Date(cache[block.id].expiry_time) > new Date()) {
    res.redirect(307, cache[block.id].url)
    return
  }

  // if cache does not exists
  cache[block.id] = {
    expiry_time: block.image.file.expiry_time,
    url: block.image.file.url
  }
  res.redirect(307, block.image.file.url)
}
