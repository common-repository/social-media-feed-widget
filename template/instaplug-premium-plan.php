<?php

// Exit if accessed directly
if (!defined('ABSPATH')) {
  exit;
}

?>

<!-- HTML content for the social-media-feed-widget plugin premium page UI  -->
<html lang="en">

<head>

  <meta charset="utf-8" />
  <link rel="icon" href="./favicon.ico" />
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
  <meta name="theme-color" content="#000000" />

  <title><?php esc_html_e('InstaPlug', 'social-media-feed-widget') ?></title>
</head>

<body>
  <noscript><?php esc_html_e('You need to enable JavaScript to run this app.', 'social-media-feed-widget') ?></noscript>
  <div class="instaplug-widget-wrapper" id="lwip-root">
    <section class="ant-layout main-wrapper css-1ym4yry">
      <section class="ant-layout lwip-full-width lwip-d-flex full-height css-1ym4yry">
        <section class="ant-layout css-1ym4yry">
          <main class="ant-layout-content instaplug-content-container">
            <div class="common-dashboard-btn">

            </div>
            <div class="ant-spin-nested-loading css-1ym4yry">
              <div class="ant-spin-container">
                <div class="pricing-table-container lwip-d-flex flex-vertical align-center justify-center full-height">
                  <div class="lwip-lwip-premium-footer-btn mt-10">
                    <h1 class="pricing-heading"><?php esc_html_e('Pricing Plans', 'social-media-feed-widget') ?></h1>
                  </div>
                  <div id="text-block-9" class="mk-text-block jupiter-donut- pricing-table-wrapper lwip-mt-8">
                    <div class="ip-block">
                      <div class="ip-table-responsive">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <thead>
                            <tr>
                              <th class="text bg-white-smoke" aria-label="empty-th-4">
                                <p class="m-0 pricing-description text-capitalize">
                                  <?php esc_html_e('Our pricing plans are designed to be', 'social-media-feed-widget') ?>
                                  <span class="highlight-text"><?php esc_html_e('Affordable', 'social-media-feed-widget') ?></span>,<span class="highlight-text">
                                    <?php esc_html_e('Flexible', 'social-media-feed-widget') ?></span>
                                  <?php esc_html_e('and', 'social-media-feed-widget') ?><span class="highlight-text">
                                    <?php esc_html_e('Tailored', 'social-media-feed-widget') ?></span>
                                  <?php esc_html_e('to your unique needs', 'social-media-feed-widget') ?>
                                </p>
                              </th>
                              <th class="headding">
                                <span><?php esc_html_e('Free', 'social-media-feed-widget') ?> </span><span class="bill-amount"><?php esc_html_e('$0', 'social-media-feed-widget') ?></span>
                              </th>
                              <th class="headding">
                                <label class="colum-lable"><?php esc_html_e('LIMITED OFFER', 'social-media-feed-widget') ?></label><span><?php esc_html_e('Life Time Deal', 'social-media-feed-widget') ?> </span><span class="bill-amount"><?php esc_html_e('$39', 'social-media-feed-widget') ?></span>
                              </th>
                            </tr>
                            <tr class="">
                              <th class="text bg-white-smoke" aria-label="empty-th-4"></th>
                              <th class="text bg-white-smoke" aria-label="empty-th-3">
                                <button type="button" class="lwip-ant-btn css-1ym4yry lwip-ant-btn-primary lwip-ant-btn-lg buy-button instaplug-active-plan-button" disabled="">
                                  <span><?php esc_html_e('Active plan', 'social-media-feed-widget') ?></span>
                                </button>
                              </th>
                              <th class="text">
                                <span class="ant-badge css-1ym4yry">
                                  <button type="button" class="lwip-ant-btn css-1ym4yry lwip-ant-btn-primary lwip-ant-btn-lg buy-button instaplug-buy-premium-button" onclick="window.open('<?php echo esc_url(LWIP_SCRIPT_ENDPOINT) . 'manage-pricing'; ?>', '_blank');">
                                    <span><?php esc_html_e('Buy now', 'social-media-feed-widget') ?></span>
                                  </button>
                                  <button type="button" class="lwip-ant-btn css-1ym4yry lwip-ant-btn-primary lwip-ant-btn-lg buy-button instaplug-activated-premium-button" disabled="" style="display: none;">
                                    <span><?php esc_html_e('Active plan', 'social-media-feed-widget') ?></span>
                                  </button>

                                  <span role="img" aria-label="info-circle" class="anticon anticon-info-circle text-20 ant-scroll-number-custom-component">
                                    <svg viewBox="64 64 896 896" focusable="false" data-icon="info-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"></svg>
                                  </span>
                                </span>

                              </th>
                            </tr>
                            <tr class="hidden-mb">
                              <th class="headding col-1-child-1"><?php esc_html_e('Features', 'social-media-feed-widget') ?></th>
                              <th class="headding" aria-label="empty-th-0"></th>
                              <th class="headding" aria-label="empty-th-1"></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td class="dynamic-key-td">
                                <?php esc_html_e('Account info with follow button', 'social-media-feed-widget') ?>
                              </td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                            </tr>
                            <tr>
                              <td class="dynamic-key-td">
                                <?php esc_html_e('Adjustable feed widget size', 'social-media-feed-widget') ?>
                              </td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                            </tr>
                            <tr>
                              <td class="dynamic-key-td">
                                <?php esc_html_e('Carousel and reel support', 'social-media-feed-widget') ?>
                              </td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                            </tr>
                            <tr>
                              <td class="dynamic-key-td">
                                <?php esc_html_e('Call to action button', 'social-media-feed-widget') ?>
                              </td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                            </tr>
                            <tr>
                              <td class="dynamic-key-td">
                                <?php esc_html_e('Feed hashtag moderate', 'social-media-feed-widget') ?>
                              </td>
                              <td>
                                <span role="img" aria-label="close" class="anticon anticon-close feature-not-available"><svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path>
                                  </svg></span>
                              </td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                            </tr>
                            <tr>
                              <td class="dynamic-key-td">
                                <?php esc_html_e('Feed mentions moderate', 'social-media-feed-widget') ?>
                              </td>
                              <td>
                                <span role="img" aria-label="close" class="anticon anticon-close feature-not-available"><svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path>
                                  </svg></span>
                              </td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                            </tr>
                            <tr>
                              <td class="dynamic-key-td">
                                <?php esc_html_e('Fully responsive all devices', 'social-media-feed-widget') ?>
                              </td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                            </tr>
                            <tr>
                              <td class="dynamic-key-td"><?php esc_html_e('Hover effect', 'social-media-feed-widget') ?></td>
                              <td>
                                <span role="img" aria-label="close" class="anticon anticon-close feature-not-available"><svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path>
                                  </svg></span>
                              </td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                            </tr>
                            <tr>
                              <td class="dynamic-key-td"><?php esc_html_e('IG business feed', 'social-media-feed-widget') ?></td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                            </tr>
                            <tr>
                              <td class="dynamic-key-td"><?php esc_html_e('IG personal feed', 'social-media-feed-widget') ?></td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                            </tr>
                            <tr>
                              <td class="dynamic-key-td">
                                <?php esc_html_e('Multi layout choices', 'social-media-feed-widget') ?>
                              </td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                            </tr>
                            <tr>
                              <td class="dynamic-key-td">
                                <?php esc_html_e('Number of comments and likes', 'social-media-feed-widget') ?>
                              </td>
                              <td>
                                <span role="img" aria-label="close" class="anticon anticon-close feature-not-available"><svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path>
                                  </svg></span>
                              </td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                            </tr>
                            <tr>
                              <td class="dynamic-key-td"><?php esc_html_e('Number of views', 'social-media-feed-widget') ?></td>
                              <td><?php esc_html_e('5000', 'social-media-feed-widget') ?></td>
                              <td><?php esc_html_e('100000', 'social-media-feed-widget') ?></td>
                            </tr>
                            <tr>
                              <td class="dynamic-key-td"><?php esc_html_e('Pop up mode', 'social-media-feed-widget') ?></td>
                              <td>
                                <span role="img" aria-label="close" class="anticon anticon-close feature-not-available"><svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path>
                                  </svg></span>
                              </td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                            </tr>
                            <tr>
                              <td class="dynamic-key-td">
                                <?php esc_html_e('Social share button', 'social-media-feed-widget') ?>
                              </td>
                              <td>
                                <span role="img" aria-label="close" class="anticon anticon-close feature-not-available"><svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path>
                                  </svg></span>
                              </td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                            </tr>
                            <tr>
                              <td class="dynamic-key-td"><?php esc_html_e('Support', 'social-media-feed-widget') ?></td>
                              <td><?php esc_html_e('Bug fix', 'social-media-feed-widget') ?></td>
                              <td><?php esc_html_e('Priority', 'social-media-feed-widget') ?></td>
                            </tr>
                            <tr>
                              <td class="dynamic-key-td"><?php esc_html_e('Update time', 'social-media-feed-widget') ?></td>
                              <td><?php esc_html_e('720minute', 'social-media-feed-widget') ?></td>
                              <td><?php esc_html_e('60minute', 'social-media-feed-widget') ?></td>
                            </tr>
                            <tr>
                              <td class="dynamic-key-td"><?php esc_html_e('Watermark', 'social-media-feed-widget') ?></td>
                              <td>
                                <span role="img" aria-label="check" class="anticon anticon-check"><svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"></path>
                                  </svg></span>
                              </td>
                              <td>
                                <span role="img" aria-label="close" class="anticon anticon-close feature-not-available"><svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path>
                                  </svg></span>
                              </td>
                            </tr>
                            <tr>
                              <td class="dynamic-key-td">
                                <?php esc_html_e('Website add limit', 'social-media-feed-widget') ?></td>
                              <td>1</td>
                              <td> <?php esc_html_e('Unlimited', 'social-media-feed-widget') ?></td>
                            </tr>
                            <tr>
                              <td class="dynamic-key-td">
                                <?php esc_html_e('Widget creation limit', 'social-media-feed-widget') ?>
                              </td>
                              <td><?php esc_html_e('1', 'social-media-feed-widget') ?></td>
                              <td><?php esc_html_e('9', 'social-media-feed-widget') ?></td>
                            </tr>
                            <tr>
                              <td class="bg-white-smoke" aria-label="empty-td-1"></td>
                              <td class="text" aria-label="empty-td-2"></td>
                              <th class="text">
                                <span class="ant-badge css-1ym4yry">
                                  <button type="button" class="lwip-ant-btn css-1ym4yry lwip-ant-btn-primary lwip-ant-btn-lg buy-button instaplug-buy-premium-buttons" onclick="window.open('<?php echo esc_url(LWIP_SCRIPT_ENDPOINT) . 'manage-pricing'; ?> ', '_blank');">
                                    <span><?php esc_html_e('Buy now', 'social-media-feed-widget') ?></span>
                                  </button>
                                  <span role="img" aria-label="info-circle" class="anticon anticon-info-circle text-20 ant-scroll-number-custom-component">
                                    <svg viewBox="64 64 896 896" focusable="false" data-icon="info-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"></svg>
                                  </span>
                                </span>
                              </th>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </section>
      </section>
    </section>
  </div>

</body>

</html>