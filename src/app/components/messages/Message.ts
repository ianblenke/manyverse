/* Copyright (C) 2018 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {PureComponent} from 'react';
import {h} from '@cycle/react';
import {Msg, FeedId, MsgId} from 'ssb-typescript';
import {isPostMsg, isContactMsg, isAboutMsg} from 'ssb-typescript/utils';
import {MsgAndExtras} from '../../drivers/ssb';
import RawMessage from './RawMessage';
import PostMessage from './PostMessage';
import AboutMessage from './AboutMessage';
import ContactMessage from './ContactMessage';
import KeylessMessage from './KeylessMessage';
import {withMutantProps} from 'react-mutant-hoc';

export type State = {
  hasError: boolean;
};

export type Props = {
  msg: MsgAndExtras;
  selfFeedId: FeedId;
  onPressLike?: (ev: {msgKey: MsgId; like: boolean}) => void;
  onPressReply?: (ev: {msgKey: MsgId; rootKey: MsgId}) => void;
  onPressAuthor?: (ev: {authorFeedId: FeedId}) => void;
  onPressEtc?: (msg: Msg) => void;
};

const PostMessageM = withMutantProps(PostMessage, 'name', 'imageUrl', 'likes');
const AboutMessageM = withMutantProps(AboutMessage, 'name', 'imageUrl');
const ContactMessageM = withMutantProps(ContactMessage, 'name');
const RawMessageM = withMutantProps(RawMessage, 'name', 'imageUrl', 'likes');

export default class Message extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {hasError: false};
  }

  public componentDidCatch(error: any, info: any) {
    console.log('Message componentDidCatch');
    this.setState(() => ({hasError: true}));
  }

  public render() {
    const {msg} = this.props;
    const streams = this.props.msg.value._streams;
    const props = {
      ...this.props,
      msg: msg as Msg<any>,
      likes: streams.likes,
      name: streams.about.name,
      imageUrl: streams.about.imageUrl,
    };
    if (this.state.hasError) return h(RawMessageM, props);
    if (!msg.key) return h(KeylessMessage, props);
    if (isPostMsg(msg)) return h(PostMessageM, props);
    if (isAboutMsg(msg)) return h(AboutMessageM, props);
    if (isContactMsg(msg)) return h(ContactMessageM, props);
    return h(RawMessageM, props);
  }
}
