import { Client } from "@notionhq/client";
import { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function getDatabase(databaseId: string) {
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  return response.results;
};

export async function getPage(pageId: string): Promise<GetPageResponse> {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
};

export async function getBlocks(blockId: string) {
  const blocks = [];
  let cursor: string;
  while (true) {
    const { results, next_cursor } = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    });
    blocks.push(...results);
    if (!next_cursor) {
      break;
    }
    cursor = next_cursor;
  }
  return blocks;
};
