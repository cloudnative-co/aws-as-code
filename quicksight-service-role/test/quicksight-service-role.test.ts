import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as QuicksightServiceRole from '../lib/quicksight-service-role-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new QuicksightServiceRole.QuicksightServiceRoleStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
