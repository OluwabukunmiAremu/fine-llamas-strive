import { CalculatorOutlined } from '@ant-design/icons';
import { Badge, Card, List } from 'antd'
import { Text } from "../text"
import { useState } from 'react';
import { list } from 'postcss';
import { UpcomingEventsSkeleton } from '../skeleton/upcoming-events';
import { useList } from '@refinedev/core';
import { DASHBORAD_CALENDAR_UPCOMING_EVENTS_QUERY } from '@/graphql/queries';
import dayjs from 'dayjs';
import { getDate } from '@/utilities/helpers';




const UpcomingEvents = () => {

  const { data, isLoading } = useList({
    resource: "events",
    pagination: { pageSize: 5 },
    sorters: [
      {
        field: "startDate",
        order: "asc"
      }
    ],
    filters: [
      {
        field: "startDate",
        operator: "gte",
        value: dayjs().format("YYYY-MM-DD")
      }
    ],
    meta: {
      gqlQuery: DASHBORAD_CALENDAR_UPCOMING_EVENTS_QUERY
    }
  })

  console.log({ data })
  return (
    <Card
      style={{ height: "100%" }}
      styles={{
        header: { padding: "8px 16px" },
        body: { padding: "8px 16px" }
      }}
      title={
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <CalculatorOutlined />
          <Text size="sm" style={{ marginLeft: "0.7rem" }}>
            Upcoming Events
          </Text>


        </div>

      }
    >
      {isLoading ? (
        <List
          itemLayout='horizontal'
          dataSource={Array.from({ length: 5 }).map((_, index) => ({ id: index }))}
          renderItem={() => <UpcomingEventsSkeleton />}
        />

      ) : (
        <List
          itemLayout='horizontal'
          dataSource={data?.data || []}
          renderItem={(item) => {
            const renderDate = getDate(item.startDate, item.endDate)
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={<Badge color={item.color} />}
                  title={<Text size='xs' style={{
                    textTransform: 'capitalize'
                  }}>{renderDate}</Text>}
                  description={<Text ellipsis={{ tooltip: true }} strong>
                    {item.title}
                  </Text>}


                />
              </List.Item>
            )
          }}
        />
      )}
      {!isLoading && data?.data.length === 0 && (
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "220px"
          }}
        >
          No Upcoming Events
        </span>
      )}
    </Card>
  )
}

export default UpcomingEvents