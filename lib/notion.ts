import { Client } from '@notionhq/client'
import {
  GetPageResponse,
  QueryDatabaseResponse
} from '@notionhq/client/build/src/api-endpoints'
import { getPlaiceholder } from 'plaiceholder'
import { BlockObjectResponse, ListBlockChildrenResponse } from './notionTypes'

const notion = new Client({
  auth: process.env.NOTION_TOKEN
})

export async function getDatabase(
  databaseId: string
): Promise<QueryDatabaseResponse> {
  const response = await notion.databases.query({
    database_id: databaseId
  })
  return response
}

export async function getPage(pageId: string): Promise<GetPageResponse> {
  const response = await notion.pages.retrieve({ page_id: pageId })
  return response
}

export async function getBlock(blockId: string) {
  const response = await notion.blocks.retrieve({
    block_id: blockId
  })
  return response as BlockObjectResponse
}

/*
  List all children blocks under a parent block
*/
export async function listChildrenBlocks(
  blockId: string
): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = []
  let response: ListBlockChildrenResponse
  do {
    response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      start_cursor: response?.next_cursor
    })
    const blocksWithImage = await Promise.all(
      (response.results as BlockObjectResponse[]).map(async (block) => {
        if (block.type === 'image') {
          const imageUrl = block.image[block.image.type].url
          const { base64, img } = await getPlaiceholder(imageUrl)
          block.image.blurDataURL = base64
          block.image.width = img.width
          block.image.height = img.height
          block.image.src = img.src
        }
        return block
      })
    )
    blocks.push(...blocksWithImage)
  } while (response.has_more && response.next_cursor)
  return blocks
}

/* 
  Recursively get all children of a parent block
*/
async function getChildren(
  block: BlockObjectResponse
): Promise<BlockObjectResponse> {
  // return if the block does not have a child
  if (!block.has_children) {
    return block
  }

  // get all children
  const childrenBlocks = await listChildrenBlocks(block.id)

  // get grandchildren for children recursively
  const children = await Promise.all(
    childrenBlocks.map(async (block) => {
      return getChildren(block)
    })
  )

  block.children = children
  return block
}

export const getPageBlocks = async (
  pageId: string
): Promise<BlockObjectResponse[]> => {
  // get all blocks
  const blocks = await listChildrenBlocks(pageId)
  // get all children blocks
  const blocksWithChildren = await Promise.all(
    blocks.map(async (block) => await getChildren(block))
  )
  return blocksWithChildren
}
