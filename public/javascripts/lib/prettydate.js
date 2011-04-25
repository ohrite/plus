/*
 * Copyright (c) 2008 David Crawshaw <david@zentus.com>
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

/*
 * Returns a string representation of a JS Date object that is relative
 * to the present time, e.g. "1 minute ago" or "3 years ago".
 */
prettydate = function(d) {
    if (d == null || d.constructor != Date)
        return null;
    var now = new Date();
    var diff = (now.getTime() - d.getTime()) / 1000;


    // FIXME: calculation not very accurate towards months/years
    if (diff < 0)  return "future event";
    if (diff == 0) return "now";
    if (diff == 1) return "1 second ago";
    if (diff < 60) return "" + Math.round(diff) + " seconds ago";
    diff = Math.round(diff / 60);
    if (diff == 1) return "1 minute ago";
    if (diff < 60) return "" + diff + " minutes ago";
    diff = Math.round(diff / 60);
    if (diff == 1) return "1 hour ago";
    if (diff < 24) return "" + diff + " hours ago";
    diff = Math.round(diff / 24);
    if (diff == 1) return "1 day ago";
    if (diff < 7)  return "" + diff + " days ago";
    diff = Math.round(diff / 7);
    if (diff == 1) return "1 week ago";
    if (diff < 4)  return "" + diff + " weeks ago";
    diff = Math.round(diff / 4);
    if (diff == 1) return "1 month ago";
    if (diff < 12) return "" + diff + " months ago";
    diff = Math.round(diff / 12);
    if (diff == 1) return "1 year ago";
    return "" + diff + " years ago";
};
