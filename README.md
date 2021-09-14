<p align="center">
  <a href="https://github.com/Rollingegg/feishu-robot-action/actions"><img alt="feishu-robot-action status" src="https://github.com/Rollingegg/feishu-robot-action/workflows/build-test/badge.svg"></a>
</p>

# GitHub Actions for Feishu Robot

> [How do I use a robot in a group chat?](https://getfeishu.cn/hc/zh-cn/articles/360024984973-在群聊中使用机器人)

## ✨ Usage

| option  | required | description                                                  |
| ------- | -------- | ------------------------------------------------------------ |
| uuid    | true     | feishu robot webhook url uuid                                |
| secret  | false    | webhook authentication [secret](https://www.feishu.cn/hc/zh-CN/articles/360024984973#lineguid-RahdJr) |
| version | false    | api version of webhook, default 2                            |
| text    | false    | text content                                                 |
| json    | false    | [raw message body](https://www.feishu.cn/hc/zh-CN/articles/360024984973#lineguid-A7THGC) |

## ✨ Example

### Simple Text

```yaml
uses: Rollingegg/feishu-robot-action
with:
  uuid: 954e40d7-****-4111-****-649b5e0ba5f9
  text: hello github actions
```

### Raw Message(JSON)

```yaml
uses: Rollingegg/feishu-robot-action
with:
  uuid: 954e40d7-****-4111-****-649b5e0ba5f9
  json: |
    {"msg_type":"text","content":{"text":"test data from test runs"}}
```

### With Secret(Optional)

```yaml
uses: Rollingegg/feishu-robot-action
with:
  uuid: 954e40d7-****-4111-****-649b5e0ba5f9
  secret: UHbDROd****UZyvTyvwafe
  json: |
    {"msg_type":"text","content":{"text":"test data from test runs"}}
```

### Support API v1(Optional)

```yaml
uses: Rollingegg/feishu-robot-action
with:
  uuid: 9b88071886****669d3771dab2018ccc
  version: 1
  text: hello github actions
```

