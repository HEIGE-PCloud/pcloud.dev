import { Client, isNotionClientError } from "@notionhq/client";
import { GetPageResponse, GetBlockResponse, QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function getDatabase(databaseId: string): Promise<QueryDatabaseResponse> {
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  return response;
};

export async function getPage(pageId: string): Promise<GetPageResponse> {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
};

export async function getBlockChildren(blockId: string): Promise<GetBlockResponse[]> {
  const blocks: GetBlockResponse[] = [];
  let cursor: string | undefined = undefined;
  while (true) {
    const { results, has_more, next_cursor } = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    });
    blocks.push(...results);
    if (!has_more) {
      break;
    }
    cursor = next_cursor;
  }
  return blocks;
};
