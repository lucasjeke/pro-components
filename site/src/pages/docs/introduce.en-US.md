---
title: Introduction
order: 1
---

## The concept of ProComponents

Ant Design defines the basic design specification and provides a large number of basic components. However, for middle and backend applications, we want to provide a higher level of abstraction, provide higher level design specifications, and provide corresponding components so that developers can quickly build high quality pages.

In ProComponents, we have a series of built-in design specifications and pre-defined common logic. For example, you can use ProTable as an Ant Design Table, and ProForm as a base component of Ant Design or as a custom component. We hope to further extend the capabilities of Ant Design by providing the ability to build high quality middle and backend applications quickly and efficiently with the Pro series components.

## Design Ideas

For almost any business, what we do is actually define a series of behaviors based on a state, take the table above as an example, first we need a state `dataSource` for storing the data requested from the server, and for optimizing the experience, we also need a `loading`. So we have a series of behaviors, we need to set `loading=true` first, then launch a network request, after the network request is completed, set `dataSource` for the requested data, `loading=false`, a network request is completed, although very simple, but a business system has a considerable number of tables, and each table is defined so once, the workload is very large.

If you want to re-request the network, we need to encapsulate the behavior, the above behavior into a method, click to reload the data, if you have paging, then you need a new variable page, we need to go before the re-request according to the need to determine whether to reset the page to the first page, which introduces another variable. If your form also has to control the number of pages per page, then it will be even more cumbersome. This kind of repetitive work can waste a lot of our time.
