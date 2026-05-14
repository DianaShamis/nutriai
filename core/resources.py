from typing import Optional
import aiohttp
import redis.asyncio as redis


async def create_redis_client(redis_url: str) -> redis.Redis:
    client = redis.from_url(redis_url, decode_responses=True)
    await client.ping()
    return client


async def close_redis_client(client: Optional[redis.Redis]) -> None:
    if client is None:
        return
    await client.close()


def create_http_session() -> aiohttp.ClientSession:
    timeout = aiohttp.ClientTimeout(total=30)
    return aiohttp.ClientSession(timeout=timeout)


async def close_http_session(session: Optional[aiohttp.ClientSession]) -> None:
    if session is None:
        return
    await session.close()